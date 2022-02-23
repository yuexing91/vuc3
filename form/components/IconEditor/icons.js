const ICONS = {
  line: {
    direction: 'StepBackwardOutlined,StepForwardOutlined,FastBackwardOutlined,FastForwardOutlined,ShrinkOutlined,ArrowsAltOutlined,DownOutlined,UpOutlined,LeftOutlined,RightOutlined,CaretUpOutlined,CaretDownOutlined,CaretLeftOutlined,CaretRightOutlined,UpCircleOutlined,DownCircleOutlined,LeftCircleOutlined,RightCircleOutlined,DoubleRightOutlined,DoubleLeftOutlined,VerticalLeftOutlined,VerticalRightOutlined,VerticalAlignTopOutlined,VerticalAlignMiddleOutlined,VerticalAlignBottomOutlined,ForwardOutlined,BackwardOutlined,RollbackOutlined,EnterOutlined,RetweetOutlined,SwapOutlined,SwapLeftOutlined,SwapRightOutlined,ArrowUpOutlined,ArrowDownOutlined,ArrowLeftOutlined,ArrowRightOutlined,PlayCircleOutlined,UpSquareOutlined,DownSquareOutlined,LeftSquareOutlined,RightSquareOutlined,LoginOutlined,LogoutOutlined,MenuFoldOutlined,MenuUnfoldOutlined,BorderBottomOutlined,BorderHorizontalOutlined,BorderInnerOutlined,BorderOuterOutlined,BorderLeftOutlined,BorderRightOutlined,BorderTopOutlined,BorderVerticleOutlined,PicCenterOutlined,PicLeftOutlined,PicRightOutlined,RadiusBottomleftOutlined,RadiusBottomrightOutlined,RadiusUpleftOutlined,RadiusUprightOutlined,FullscreenOutlined,FullscreenExitOutlined'.split(
      ','
    ),
    tips: 'QuestionOutlined,QuestionCircleOutlined,PlusOutlined,PlusCircleOutlined,PauseOutlined,PauseCircleOutlined,MinusOutlined,MinusCircleOutlined,PlusSquareOutlined,MinusSquareOutlined,InfoOutlined,InfoCircleOutlined,ExclamationOutlined,ExclamationCircleOutlined,CloseOutlined,CloseCircleOutlined,CloseSquareOutlined,CheckOutlined,CheckCircleOutlined,CheckSquareOutlined,ClockCircleOutlined,WarningOutlined,IssuesCloseOutlined,StopOutlined'.split(
      ','
    ),
    edit: 'EditOutlined,FormOutlined,CopyOutlined,ScissorOutlined,DeleteOutlined,SnippetsOutlined,DiffOutlined,HighlightOutlined,AlignCenterOutlined,AlignLeftOutlined,AlignRightOutlined,BgColorsOutlined,BoldOutlined,ItalicOutlined,UnderlineOutlined,StrikethroughOutlined,RedoOutlined,UndoOutlined,ZoomInOutlined,ZoomOutOutlined,FontColorsOutlined,FontSizeOutlined,LineHeightOutlined,DashOutlined,SmallDashOutlined,SortAscendingOutlined,SortDescendingOutlined,DragOutlined,OrderedListOutlined,UnorderedListOutlined,RadiusSettingOutlined,ColumnWidthOutlined,ColumnHeightOutlined'.split(
      ','
    ),
    data: 'AreaChartOutlined,PieChartOutlined,BarChartOutlined,DotChartOutlined,LineChartOutlined,RadarChartOutlined,HeatMapOutlined,FallOutlined,RiseOutlined,StockOutlined,BoxPlotOutlined,FundOutlined,SlidersOutlined'.split(
      ','
    ),
    web: 'AccountBookOutlined,AimOutlined,AlertOutlined,ApartmentOutlined,ApiOutlined,AppstoreAddOutlined,AppstoreOutlined,AudioOutlined,AudioMutedOutlined,AuditOutlined,BankOutlined,BarcodeOutlined,BarsOutlined,BellOutlined,BlockOutlined,BookOutlined,BorderOutlined,BorderlessTableOutlined,BranchesOutlined,BugOutlined,BuildOutlined,BulbOutlined,CalculatorOutlined,CalendarOutlined,CameraOutlined,CarOutlined,CarryOutOutlined,CiCircleOutlined,CiOutlined,ClearOutlined,CloudDownloadOutlined,CloudOutlined,CloudServerOutlined,CloudSyncOutlined,CloudUploadOutlined,ClusterOutlined,CodeOutlined,CoffeeOutlined,CommentOutlined,CompassOutlined,CompressOutlined,ConsoleSqlOutlined,ContactsOutlined,ContainerOutlined,ControlOutlined,CopyrightOutlined,CreditCardOutlined,CrownOutlined,CustomerServiceOutlined,DashboardOutlined,DatabaseOutlined,DeleteColumnOutlined,DeleteRowOutlined,DeliveredProcedureOutlined,DeploymentUnitOutlined,DesktopOutlined,DingtalkOutlined,DisconnectOutlined,DislikeOutlined,DollarCircleOutlined,DollarOutlined,DownloadOutlined,EllipsisOutlined,EnvironmentOutlined,EuroCircleOutlined,EuroOutlined,ExceptionOutlined,ExpandAltOutlined,ExpandOutlined,ExperimentOutlined,ExportOutlined,EyeOutlined,EyeInvisibleOutlined,FieldBinaryOutlined,FieldNumberOutlined,FieldStringOutlined,FieldTimeOutlined,FileAddOutlined,FileDoneOutlined,FileExcelOutlined,FileExclamationOutlined,FileOutlined,FileGifOutlined,FileImageOutlined,FileJpgOutlined,FileMarkdownOutlined,FilePdfOutlined,FilePptOutlined,FileProtectOutlined,FileSearchOutlined,FileSyncOutlined,FileTextOutlined,FileUnknownOutlined,FileWordOutlined,FileZipOutlined,FilterOutlined,FireOutlined,FlagOutlined,FolderAddOutlined,FolderOutlined,FolderOpenOutlined,FolderViewOutlined,ForkOutlined,FormatPainterOutlined,FrownOutlined,FunctionOutlined,FundProjectionScreenOutlined,FundViewOutlined,FunnelPlotOutlined,GatewayOutlined,GifOutlined,GiftOutlined,GlobalOutlined,GoldOutlined,GroupOutlined,HddOutlined,HeartOutlined,HistoryOutlined,HomeOutlined,HourglassOutlined,IdcardOutlined,ImportOutlined,InboxOutlined,InsertRowAboveOutlined,InsertRowBelowOutlined,InsertRowLeftOutlined,InsertRowRightOutlined,InsuranceOutlined,InteractionOutlined,KeyOutlined,LaptopOutlined,LayoutOutlined,LikeOutlined,LineOutlined,LinkOutlined,Loading3QuartersOutlined,LoadingOutlined,LockOutlined,MacCommandOutlined,MailOutlined,ManOutlined,MedicineBoxOutlined,MehOutlined,MenuOutlined,MergeCellsOutlined,MessageOutlined,MobileOutlined,MoneyCollectOutlined,MonitorOutlined,MoreOutlined,NodeCollapseOutlined,NodeExpandOutlined,NodeIndexOutlined,NotificationOutlined,NumberOutlined,OneToOneOutlined,PaperClipOutlined,PartitionOutlined,PayCircleOutlined,PercentageOutlined,PhoneOutlined,PictureOutlined,PlaySquareOutlined,PoundCircleOutlined,PoundOutlined,PoweroffOutlined,PrinterOutlined,ProfileOutlined,ProjectOutlined,PropertySafetyOutlined,PullRequestOutlined,PushpinOutlined,QrcodeOutlined,ReadOutlined,ReconciliationOutlined,RedEnvelopeOutlined,ReloadOutlined,RestOutlined,RobotOutlined,RocketOutlined,RotateLeftOutlined,RotateRightOutlined,SafetyCertificateOutlined,SafetyOutlined,SaveOutlined,ScanOutlined,ScheduleOutlined,SearchOutlined,SecurityScanOutlined,SelectOutlined,SendOutlined,SettingOutlined,ShakeOutlined,ShareAltOutlined,ShopOutlined,ShoppingCartOutlined,ShoppingOutlined,SisternodeOutlined,SkinOutlined,SmileOutlined,SolutionOutlined,SoundOutlined,SplitCellsOutlined,StarOutlined,SubnodeOutlined,SwitcherOutlined,SyncOutlined,TableOutlined,TabletOutlined,TagOutlined,TagsOutlined,TeamOutlined,ThunderboltOutlined,ToTopOutlined,ToolOutlined,TrademarkCircleOutlined,TrademarkOutlined,TransactionOutlined,TranslationOutlined,TrophyOutlined,UngroupOutlined,UnlockOutlined,UploadOutlined,UsbOutlined,UserAddOutlined,UserDeleteOutlined,UserOutlined,UserSwitchOutlined,UsergroupAddOutlined,UsergroupDeleteOutlined,VerifiedOutlined,VideoCameraAddOutlined,VideoCameraOutlined,WalletOutlined,WhatsAppOutlined,WifiOutlined,WomanOutlined'.split(
      ','
    ),
  },
  fill: {
    direction: 'StepBackwardFilled,StepForwardFilled,FastBackwardFilled,FastForwardFilled,CaretUpFilled,CaretDownFilled,CaretLeftFilled,CaretRightFilled,UpCircleFilled,DownCircleFilled,LeftCircleFilled,RightCircleFilled,ForwardFilled,BackwardFilled,PlayCircleFilled,UpSquareFilled,DownSquareFilled,LeftSquareFilled,RightSquareFilled'.split(
      ','
    ),
    tips: 'QuestionCircleFilled,PlusCircleFilled,PauseCircleFilled,MinusCircleFilled,PlusSquareFilled,MinusSquareFilled,InfoCircleFilled,ExclamationCircleFilled,CloseCircleFilled,CloseSquareFilled,CheckCircleFilled,CheckSquareFilled,ClockCircleFilled,WarningFilled,StopFilled'.split(
      ','
    ),
    edit: 'EditFilled,CopyFilled,DeleteFilled,SnippetsFilled,DiffFilled,HighlightFilled'.split(','),
    data: 'PieChartFilled,BoxPlotFilled,FundFilled,SlidersFilled'.split(','),
    web: 'AccountBookFilled,AlertFilled,AlipaySquareFilled,AmazonCircleFilled,AmazonSquareFilled,ApiFilled,AppstoreFilled,AudioFilled,BankFilled,BehanceCircleFilled,BellFilled,BookFilled,BugFilled,BuildFilled,BulbFilled,CalculatorFilled,CalendarFilled,CameraFilled,CarFilled,CarryOutFilled,CiCircleFilled,CloudFilled,CodeFilled,CodeSandboxSquareFilled,CodepenSquareFilled,CompassFilled,ContactsFilled,ContainerFilled,ControlFilled,CreditCardFilled,CrownFilled,CustomerServiceFilled,DashboardFilled,DatabaseFilled,DingtalkCircleFilled,DingtalkSquareFilled,DislikeFilled,DollarCircleFilled,DribbbleCircleFilled,DropboxCircleFilled,DropboxSquareFilled,EnvironmentFilled,EuroCircleFilled,ExperimentFilled,EyeFilled,EyeInvisibleFilled,FileAddFilled,FileExcelFilled,FileExclamationFilled,FileFilled,FileImageFilled,FileMarkdownFilled,FilePdfFilled,FilePptFilled,FileTextFilled,FileUnknownFilled,FileWordFilled,FileZipFilled,FilterFilled,FireFilled,FlagFilled,FolderAddFilled,FolderFilled,FolderOpenFilled,FormatPainterFilled,FrownFilled,FunnelPlotFilled,GiftFilled,GoldFilled,GoldenFilled,GoogleCircleFilled,GooglePlusCircleFilled,GooglePlusSquareFilled,GoogleSquareFilled,HddFilled,HeartFilled,HomeFilled,HourglassFilled,IdcardFilled,IeCircleFilled,IeSquareFilled,InsuranceFilled,InteractionFilled,LayoutFilled,LikeFilled,LockFilled,MacCommandFilled,MailFilled,MedicineBoxFilled,MediumCircleFilled,MediumSquareFilled,MehFilled,MessageFilled,MobileFilled,MoneyCollectFilled,NotificationFilled,PayCircleFilled,PhoneFilled,PictureFilled,PlaySquareFilled,PoundCircleFilled,PrinterFilled,ProfileFilled,ProjectFilled,PropertySafetyFilled,PushpinFilled,QqCircleFilled,QqSquareFilled,ReadFilled,ReconciliationFilled,RedEnvelopeFilled,RedditCircleFilled,RedditSquareFilled,RestFilled,RobotFilled,RocketFilled,SafetyCertificateFilled,SaveFilled,ScheduleFilled,SecurityScanFilled,SettingFilled,ShopFilled,ShoppingFilled,SignalFilled,SketchCircleFilled,SketchSquareFilled,SkinFilled,SlackCircleFilled,SmileFilled,SoundFilled,StarFilled,SwitcherFilled,TabletFilled,TagFilled,TagsFilled,TaobaoSquareFilled,ThunderboltFilled,ToolFilled,TrademarkCircleFilled,TrophyFilled,TwitterCircleFilled,TwitterSquareFilled,UnlockFilled,UsbFilled,VideoCameraFilled,WalletFilled,ZhihuCircleFilled,ZhihuSquareFilled'.split(
      ','
    ),
  },
  two: {
    direction: 'UpCircleTwoTone,DownCircleTwoTone,LeftCircleTwoTone,RightCircleTwoTone,PlayCircleTwoTone,UpSquareTwoTone,DownSquareTwoTone,LeftSquareTwoTone,RightSquareTwoTone'.split(
      ','
    ),
    tips: 'QuestionCircleTwoTone,PlusCircleTwoTone,PauseCircleTwoTone,MinusCircleTwoTone,PlusSquareTwoTone,MinusSquareTwoTone,InfoCircleTwoTone,ExclamationCircleTwoTone,CloseCircleTwoTone,CloseSquareTwoTone,CheckCircleTwoTone,CheckSquareTwoTone,ClockCircleTwoTone,WarningTwoTone,StopTwoTone'.split(
      ','
    ),
    edit: 'EditTwoTone,CopyTwoTone,DeleteTwoTone,SnippetsTwoTone,DiffTwoTone,HighlightTwoTone'.split(','),
    data: 'PieChartTwoTone,BoxPlotTwoTone,FundTwoTone,SlidersTwoTone'.split(','),
    web: 'AccountBookTwoTone,AlertTwoTone,ApiTwoTone,AppstoreTwoTone,AudioTwoTone,BankTwoTone,BellTwoTone,BookTwoTone,BugTwoTone,BuildTwoTone,BulbTwoTone,CalculatorTwoTone,CalendarTwoTone,CameraTwoTone,CarTwoTone,CarryOutTwoTone,CiCircleTwoTone,CiTwoTone,CloudTwoTone,CodeTwoTone,CompassTwoTone,ContactsTwoTone,ContainerTwoTone,ControlTwoTone,CopyrightTwoTone,CreditCardTwoTone,CrownTwoTone,CustomerServiceTwoTone,DashboardTwoTone,DatabaseTwoTone,DislikeTwoTone,DollarCircleTwoTone,DollarTwoTone,EnvironmentTwoTone,EuroCircleTwoTone,EuroTwoTone,ExperimentTwoTone,EyeTwoTone,EyeInvisibleTwoTone,FileAddTwoTone,FileExcelTwoTone,FileExclamationTwoTone,FileTwoTone,FileImageTwoTone,FileMarkdownTwoTone,FilePdfTwoTone,FilePptTwoTone,FileTextTwoTone,FileUnknownTwoTone,FileWordTwoTone,FileZipTwoTone,FilterTwoTone,FireTwoTone,FlagTwoTone,FolderAddTwoTone,FolderTwoTone,FolderOpenTwoTone,FrownTwoTone,FunnelPlotTwoTone,GiftTwoTone,GoldTwoTone,HddTwoTone,HeartTwoTone,HomeTwoTone,HourglassTwoTone,IdcardTwoTone,InsuranceTwoTone,InteractionTwoTone,LayoutTwoTone,LikeTwoTone,LockTwoTone,MailTwoTone,MedicineBoxTwoTone,MehTwoTone,MessageTwoTone,MobileTwoTone,MoneyCollectTwoTone,NotificationTwoTone,PhoneTwoTone,PictureTwoTone,PlaySquareTwoTone,PoundCircleTwoTone,PrinterTwoTone,ProfileTwoTone,ProjectTwoTone,PropertySafetyTwoTone,PushpinTwoTone,ReconciliationTwoTone,RedEnvelopeTwoTone,RestTwoTone,RocketTwoTone,SafetyCertificateTwoTone,SaveTwoTone,ScheduleTwoTone,SecurityScanTwoTone,SettingTwoTone,ShopTwoTone,ShoppingTwoTone,SkinTwoTone,SmileTwoTone,SoundTwoTone,StarTwoTone,SwitcherTwoTone,TabletTwoTone,TagTwoTone,TagsTwoTone,ThunderboltTwoTone,ToolTwoTone,TrademarkCircleTwoTone,TrophyTwoTone,UnlockTwoTone,UsbTwoTone,VideoCameraTwoTone,WalletTwoTone'.split(
      ','
    ),
  },
};
const IconMap = {};

Object.values(ICONS).forEach((obj) => {
  Object.values(obj).forEach((icons) => {
    icons.forEach((icon) => (IconMap[icon] = true));
  });
});

function isAntIcon(tag) {
  return IconMap[camelize(tag)];
}

function camelize(str) {
  if (!str) return '';
  str = str.replace(/-(\w)/g, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
  return str[0].toUpperCase() + str.substring(1);
}

export { ICONS, isAntIcon, camelize };
